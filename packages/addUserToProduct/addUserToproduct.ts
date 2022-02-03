import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MutationCreateProductArgs } from '@vendure/common/lib/generated-types';
import {
    Allow,
    Ctx,
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
        input.customFields = { user: { id: ctx.activeUserId } };
        return this.productService.create(ctx, input);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ProductService],
    adminApiExtensions: {
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
