import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { HealthMark } from './entities/health.entity';
import { HealthMarkArgs, HealthMarkInput } from './dtos/health.dto';

@Injectable()
export class HealthService {
    constructor(@InjectRepository(HealthMark) private readonly repository: Repository<HealthMark>){}

    insertOne(healthMark : HealthMarkArgs): boolean {
        try {
            this.repository.insert(healthMark);
            return true;
        } catch {
            return false;
        }
    }

    getOne(id: number): Promise<HealthMark> {
        return this.repository.findOne({where: { id }})
    }

    getAll(): Promise<HealthMark[]>{
        return this.repository.find();
    }
}
