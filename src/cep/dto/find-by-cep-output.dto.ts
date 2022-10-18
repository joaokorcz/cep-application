import { ApiProperty } from '@nestjs/swagger';

class FoundCity {
    @ApiProperty()
    name: string;
}

class FoundState {
    @ApiProperty()
    name: string;
}

export class FindByCepOutputDto {
    @ApiProperty()
    address: string;

    @ApiProperty()
    neighborhood: string;

    @ApiProperty({ type: FoundCity })
    city: FoundCity;

    @ApiProperty()
    state: FoundState;
}
