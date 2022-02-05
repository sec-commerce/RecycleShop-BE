import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MutationCreateProductArgs } from '@vendure/common/lib/generated-types';
import { QueryProductsByUserIdArgs } from '@vendure/common/src/generated-types';
import {
    Allow,
    Ctx,
    ListQueryOptions,
    PaginatedList,
    Permission,
    PluginCommonModule,
    Product,
    ProductService,
    RequestContext,
    Transaction,
    Translated,
    User,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';

const schemaExtension = gql`
    extend type Query {
        productsByUserId(options: ProductListOptions, id: ID!): ProductList!
    }
`;

@Resolver()
class ProductResolver {
    constructor(private productService: ProductService) {}

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateCatalog, Permission.CreateProduct)
    async createProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateProductArgs,
    ): Promise<Translated<Product>> {
        const { input } = args;
        input.customFields = { userId: ctx.activeUserId };
        return this.productService.create(ctx, input);
    }

    @Query()
    async productsByUserId(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductsByUserIdArgs,
    ): Promise<PaginatedList<Translated<Product>>> {
        if (args.id) {
            const options: ListQueryOptions<Product> = {
                ...args.options,
                filter: {
                    ...(args.options && args.options.filter),
                    enabled: { eq: true },
                },
            };

            return this.productService.findAllByUserId(ctx, args.id, options || undefined);
        }

        return this.productService.findAll(ctx, args.options || undefined);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ProductService],
    adminApiExtensions: {
        schema: schemaExtension,
        resolvers: [ProductResolver],
    },
    configuration: config => {
        config.customFields.Product.push({
            type: 'relation',
            entity: User,
            graphQLType: 'User',
            eager: false,
            readonly: true,
            name: 'user',
        });
        return config;
    },
})
export class ProductUserPlugin {}
