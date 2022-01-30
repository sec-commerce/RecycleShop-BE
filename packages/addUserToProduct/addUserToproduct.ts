import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Ctx, ID, Product, RequestContext, User } from '@vendure/core';
import gql from 'graphql-tag';

@Resolver('Product')
export class ProductEntityUserResolver {
    @ResolveField()
    user(@Ctx() ctx: RequestContext, @Parent() product: Product): User {
        return ProductEntityUserResolver.getUserForProduct(ctx, product.id);
    }

    private static getUserForProduct(ctx: RequestContext, id: ID): User {
        return new User();
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    adminApiExtensions: {
        schema: gql`
            extend type Product {
                user: User!
            }
        `,
        resolvers: [ProductEntityUserResolver],
    },
    configuration: config => {
        config.customFields.Product.push({
            type: 'relation',
            entity: User,
            graphQLType: 'User',
            eager: false,
            name: 'user',
        });
        return config;
    },
})
export class ProductUserPlugin {}
