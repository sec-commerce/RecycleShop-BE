import {
    ChannelAware,
    DeepPartial,
    HasCustomFields,
    Product,
    SoftDeletable,
    Translatable,
} from '@vendure/core';

export class ProductResponseType
    extends Product
    implements Translatable, HasCustomFields, ChannelAware, SoftDeletable
{
    constructor(input?: DeepPartial<ProductResponseType>) {
        super(input);
    }

    firstName?: string;
    lastName?: string;
}
