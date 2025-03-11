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
   * @param id - The ID of the email to delete.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting role ID: ${id}`);
    try {
      const existingUser = await this.userRepository.findByEmail(id);
      if (!existingUser) throw new NotFoundException('Usuario no encontrado');
      await this.userRepository.deleteUser(id);
      this.logger.log(`User email: ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete user email: ${id}`, error.stack);
      throw error;
    }
  }
}
