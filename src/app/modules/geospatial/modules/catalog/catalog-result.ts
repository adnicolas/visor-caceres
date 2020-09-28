import { Metadata } from './metadata';
import { Summary } from './summary';
export class CatalogResult {
    '@from': string;
    '@to': string;
    '@selected': string;
    summary: Summary;
    metadata: Metadata[];

    public deserialize(input: any) {
        if (!Array.isArray(input.metadata)) {
            input.metadata = [input.metadata];
        }
        Object.assign(this, input);
        this.metadata = [];
        for (const metadata of input.metadata) {
            this.metadata.push(new Metadata().deserialize(metadata));
        }
        return this;
    }
}
