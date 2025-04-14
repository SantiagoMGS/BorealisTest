import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) { }


  /**
   * Deletes a user.
   * @param email - The ID of the email to delete.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  async execute(email: string): Promise<void> {
    this.logger.log(`Deleting user email: ${email}`);
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (!existingUser) throw new NotFoundException('Usuario no encontrado');
      await this.userRepository.delete(email);
      this.logger.log(`User email: ${email} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete user email: ${email}`, (error as Error).stack);
      throw error;
    }
  }
}
