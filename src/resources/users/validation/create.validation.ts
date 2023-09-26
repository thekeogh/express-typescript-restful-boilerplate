import { IsDefined, IsEmail } from "class-validator";

/**
 * Validation rules.
 *
 * @see {@link https://github.com/typestack/class-validator class-validator}
 *
 * @remarks
 * This class specifies the validation rules for the request body using class-validator. Additionally, it serves as the
 * Request type for the controller (types.d.ts), defining the expected shape of incoming data.
 */
export class Create {
  @IsDefined({ message: "Name is required" })
  public name: string;

  @IsDefined({ message: "Email is required" })
  @IsEmail()
  public email: string;
}
