import {ApiProperty} from "@nestjs/swagger";
import {IsNumberString, IsString} from "class-validator";


export class GenerateVolatilityQuery {
    @IsString({message: 'symbol not found!'})
    @ApiProperty({
        type: String,
        example: 'abc'
    })
    symbol: string

    // @IsNumberString({}, {message: 'initial_price not found'})
    // @ApiProperty({
    //     type: Number,
    //     example: 25000
    // })
    // initial_price: string

    @IsNumberString({}, {message: 'start_time not found'})
    @ApiProperty({
        type: Number,
        example: '1420045200000 - 01-01-2015 00:00:00'
    })
    start_time: string

    @IsNumberString({}, {message: 'quantity not found'})
    @ApiProperty({
        type: Number,
        example: 1000
    })
    quantity: string
}