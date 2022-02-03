import { PluginCommonModule, User, VendurePlugin } from '@vendure/core';

// Override the resolver and attach the activeUserId from the context to the input.

// @Transaction()
// @Mutation()
// @Allow(Permission.CreateCatalog, Permission.CreateProduct)
// async createProduct(
//     @Ctx() ctx: RequestContext,
// @Args() args: MutationCreateProductArgs,
// ): Promise<Translated<Product>> {
//     const { input } = args;
//     input.customFields = {user: { id: ctx.activeUserId}};
//     return this.productService.create(ctx, input);
// }

@VendurePlugin({
    imports: [PluginCommonModule],
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
