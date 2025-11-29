declare module "input-otp" {
  import * as React from "react";

  export type OTPSlot = {
    char?: string;
    hasFakeCaret?: boolean;
    isActive?: boolean;
  };

  export const OTPInputContext: React.Context<{
    slots: OTPSlot[];
  }>;

  export const OTPInput: React.ComponentType<unknown>;

  export default OTPInput;
}
