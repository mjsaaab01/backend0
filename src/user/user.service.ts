import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { ERole } from '../types/user.type';
import { hashData } from '../utils/hash-data.util';
import { MailerService } from 'src/utils/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto, key: string) {
    let {
      name,
      email,
      password,
      role,
    }: {
      name: string;
      email: string;
      password: string;
      role: ERole;
    } = createUserDto;

    password = await hashData(password);

    await this.userModel.create({
      name,
      email,
      password,
      role,
      key,
    });

    return { message: 'Successfully Registered' };
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({
      email,
    });
  }

  async findUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const checkEmail: User | null = await this.findUserByEmail(email);

    if (!checkEmail) {
      this.CredentialIncorrect();
    }

    const isMatch: boolean = await bcrypt.compare(
      password,
      checkEmail.password,
    );

    if (!isMatch) {
      this.CredentialIncorrect();
    }
    return checkEmail;
  }

  async deleteUserByEmail(email) {
    await this.userModel.deleteOne({ email });
  }

  findAllUsers() {
    return this.userModel.find({ role: 'user' });
  }

  findAllInvalidUsers() {
    return this.userModel.find({ isValid: false, isVerified: true });
  }

  async update(id: string, updated: any, deleted: any = {}) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException(`User with this id: ${id} is not found.`);
    }

    await this.userModel.updateOne(
      { _id: id },
      { $set: updated, $unset: deleted },
    );

    return 'User Updated Successfully';
  }

  CredentialIncorrect() {
    throw new ForbiddenException('Incorrect Credentials!');
  }

  async changePassword(id: string, newPassword: string) {
    const password = await hashData(newPassword);

    await this.userModel.updateOne({ _id: id }, { $set: { password } });
  }

  async remove(id: string) {
    this.userModel.findByIdAndDelete(id);

    const user = await this.userModel.findById(id);

    const html = `
    <div style="display: flex; justify-content: center">
      <div>
        <strong>Hello ${user.name}</strong>
          <p>Your account is invalid</p>
      </div>
    </div>
  `;

    this.mailerService.sendMail(
      user.email,
      `Validation ${process.env.GMAIL_NAME}`,
      html,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
