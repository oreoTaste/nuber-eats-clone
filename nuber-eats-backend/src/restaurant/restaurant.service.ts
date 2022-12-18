import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantDto } from './dtos/restaurant.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private readonly repository : Repository<Restaurant>){}
    getAll(name : string):Promise<Restaurant[]> {
        return this.repository.find({where: {name}})
    }

    async insert(dto: RestaurantDto):Promise<boolean> {
        try {
            const result = await this.repository.insert(dto);
            console.log('insert',result);
            return true;    
        } catch{
            return false;
        }
    }
}
