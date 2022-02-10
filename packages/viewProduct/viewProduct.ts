import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryProductArgs } from '@vendure/common/lib/generated-types';
import {
    Ctx,
    CustomerService,
    PluginCommonModule,
    ProductService,
    RequestContext,
    VendurePlugin,
} from '@vendure/core';
import { UserInputError } from '@vendure/core/src';
import gql from 'graphql-tag';

import { ProductResponseType } from './productResponseType';

@Resolver()
class ProductResolver {
    constructor(private productService: ProductService, private customerService: CustomerService) {}

    @Query()
    async product(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductArgs,
    ): Promise<ProductResponseType | undefined> {
        if (args.id) {
            const product = await this.productService.findOne(ctx, args.id);
            const productResponseType = new ProductResponseType(product);
            const customer = await this.customerService.findOneByUserId(
                ctx,
                (product?.customFields as any).user.id,
            );
            productResponseType.firstName = customer?.firstName;
            productResponseType.lastName = customer?.lastName;
            return productResponseType;
        } else {
            throw new UserInputError(`error.product-id-must-be-provided`);
        }
    }
}

const schemaExtension = gql`
    extend type Product {
        firstName: String!
        lastName: String!
    }
`;

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ProductService],
    adminApiExtensions: {
        schema: schemaExtension,
        resolvers: [ProductResolver],
    },
})
export class ViewProduct {}
