import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;
  @IsNumber()
  @IsPositive()
  exp_month: number;
  @IsNumber()
  @IsPositive()
  exp_year: number;
  @IsCreditCard()
  number: string;
}
