import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { statusSession, typeSession } from 'src/interfaces/session.enum';

export class StartSessionDto {
  @IsNotEmpty()
  @IsEnum(typeSession)
  type: typeSession;

  @IsNotEmpty()
  @IsEnum(statusSession)
  status: statusSession;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
