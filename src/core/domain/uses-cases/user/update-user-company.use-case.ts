import { Inject, Injectable, Logger } from "@nestjs/common";
import { IUserRepository } from "../../repositories/user.repository";

@Injectable()
export class UpdateUserCompanyRoleUseCase {
  private readonly logger = new Logger(UpdateUserCompanyRoleUseCase.name);

  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) { }

  async execute(userId: string, companyId: string, roleId: string): Promise<void> {
    this.logger.log(`Updating role of user ${userId} in company ${companyId}`);

    try {
      await this.userRepository.updateUserRole(userId, companyId, roleId);
      this.logger.log(`User ${userId} role updated successfully in company ${companyId}`);
    } catch (error) {
      this.logger.error(`Failed to update user role in company ${companyId}`, error.stack);
      throw error;
    }
  }
}
