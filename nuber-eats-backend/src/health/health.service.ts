import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthMark, HealthMarkGrp } from './entities/health.entity';
import { AddHealthMarkInput, AddHealthMarkOutput } from './dtos/add-health-mark.dto';
import { AddHealthMarkGrpInput, AddHealthMarkGrpOutput } from './dtos/add-health-mark-grp.dto.';

@Injectable()
export class HealthService {
    constructor(@InjectRepository(HealthMark) private readonly healthMark: Repository<HealthMark>,
                @InjectRepository(HealthMarkGrp) private readonly healthMarkGrp: Repository<HealthMarkGrp>
                ){}

    /**
     * @description 건강지표그룹 입력 (건강지표그룹 정보 필수)
     */
    async addHealthMarkGrp(addHealthMarkGrpInput: AddHealthMarkGrpInput): Promise<AddHealthMarkGrpOutput>{
        try {
            let rslt = await this.healthMarkGrp.save(addHealthMarkGrpInput);
            if(rslt) {
                return {cnt: 1, reason: 'ok', healthMarkGrpId: rslt.id};
            } else {
                return {cnt: 0, reason: `couldn't add a health group mark`, healthMarkGrpId: rslt.id};
            }
        } catch {
            return {cnt: 0, reason: 'error while add a health group mark', healthMarkGrpId: null};
        }
    }
    
    private async checkHealthMarkGroup(id: number): Promise<{ok: boolean, reason: string, id: number|null}> {
        if(!id) {
            return {ok: false, reason: 'no health mark group input', id: null};
        }
        let rslt = await this.healthMark.findOne({where: {id}});
        if(!rslt) {
            return {ok: false, reason: 'no health mark group found', id: null};
        }
        return {ok: true, reason: 'ok', id: rslt.id}
    }

    /**
     * @description 건강지표 입력 (건강지표 정보 및 건강지표그룹ID 필수)
     */
    async addHealthMark(addHealthMarkInput: AddHealthMarkInput): Promise<AddHealthMarkOutput>{
        try {
            let {ok, reason, id} = await this.checkHealthMarkGroup(addHealthMarkInput.healthMarkGrpId);
            if(!ok) {
                return {cnt: 0, reason, healthMarkId: null};
            }

            let rslt = await this.healthMark.save({...addHealthMarkInput, healthMarkGrpId: id});
            if(rslt) {
                return {cnt: 1, reason: 'ok', healthMarkId: rslt.id};
            } else {
                return {cnt: 0, reason: `couldn't add a health mark`, healthMarkId: rslt.id};
            }
        } catch {
            return {cnt: 0, reason: 'error while add a health mark', healthMarkId: null};
        }
    }

    /**
     * @description 사용자의 건강기록 조회
     */
    // async showHealthMark(showHealthMarkInput: ShowHealthMarkInput): ShowHealthMarkOutput {
    //     try {
    //         return {}
    //     } catch {

    //     }
    // }
}
