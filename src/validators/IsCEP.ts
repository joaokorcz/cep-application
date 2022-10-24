import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCEP(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isCEP',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    // regex to test if given cep is composed by exactly 8 numbers
                    const cepRegex =
                        /^([0-9]{8}|[0-9]{5}-[0-9]{3}|[0-9]{2}.[0-9]{6}|[0-9]{2}.[0-9]{3}-[0-9]{3})$/;
                    return typeof value === 'string' && cepRegex.test(value);
                },
            },
        });
    };
}
