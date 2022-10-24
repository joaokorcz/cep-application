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
    informed_code: string;

    @ApiProperty()
    code_found: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    neighborhood: string;

    @ApiProperty({ type: FoundCity })
    city: FoundCity;

    @ApiProperty()
    state: FoundState;
}
