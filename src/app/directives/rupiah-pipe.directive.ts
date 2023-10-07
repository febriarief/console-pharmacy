import { Pipe, PipeTransform } from '@angular/core'
import { DecimalPipe } from '@angular/common'

@Pipe({
    name: 'rupiahPipe'
})

export class RupiahPipeDirective implements PipeTransform 
{
    constructor(
        private _decimalPipe: DecimalPipe
    ) {

    }

    /**
     * Transforms a numeric value into a formatted string representation.
     * The value is formatted using a decimal pipe with pattern '1.0-0'.
     * The formatted value is returned with commas replaced by periods.
     *
     * @param value The numeric value to be transformed.
     * @returns The formatted string representation of the numeric value.
     */
    transform(value: number): string {
        const formattedValue = this._decimalPipe.transform(value, '1.0-0')
        return formattedValue ? 'Rp ' + formattedValue.replace(/,/g, '.') : 'Rp 0'
    }
}
