import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, In } from "typeorm";
import { User } from "./entities/user.entity";
import { Role } from "src/roles/entities/role.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Role)
        private roleRepo: Repository<Role>,
    ) {}

    async create(data: CreateUserDto) {
        const roles = data.roles
            ? await this.roleRepo.find({ where: { id: In(data.roles) } })
            : [];

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = this.userRepo.create({
            username: data.username,
            email: data.email,
            passwordHash,
            roles,
        });

        return this.userRepo.save(user);
    }

    findAll() {
        return this.userRepo.find();
    }

    async findByUsername(username: string) {
        return this.userRepo.findOne({ where: { username } });
    }

    async findOne(id: number) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: number, data: UpdateUserDto) {
        const user = await this.findOne(id);

        if (data.password) {
            user.passwordHash = await bcrypt.hash(data.password, 10);
        }
        if (data.username) user.username = data.username;
        if (data.email) user.email = data.email;

        if (data.roles) {
            const roles = await this.roleRepo.find({ where: { id: In(data.roles) } });
            user.roles = roles;
        }
        return this.userRepo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        return this.userRepo.remove(user);
    }
}
