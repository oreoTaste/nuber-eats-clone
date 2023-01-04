import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { HealthMark, HealthMarkGrp, HealthRecord } from './entities/health.entity';
import { AddHealthMarkInput, AddHealthMarkOutput } from './dtos/add-health-mark.dto';
import { AddHealthMarkGrpInput, AddHealthMarkGrpOutput } from './dtos/add-health-mark-grp.dto.';
import { ShowHealthRecordInput, ShowHealthRecordOutput } from './dtos/show-health-record.dto';
import { User } from 'src/users/entities/user.entity';
import { ShowHealthMarkGrpInput, ShowHealthMarkGrpOutput } from './dtos/show-health-mark-grp.dto';
import { ShowHealthMarkInput, ShowHealthMarkOutput } from './dtos/show-health-mark.dto';

@Injectable()
export class HealthService {
    constructor(@InjectRepository(HealthMark) private readonly healthMark: Repository<HealthMark>,
                @InjectRepository(HealthMarkGrp) private readonly healthMarkGrp: Repository<HealthMarkGrp>,
                @InjectRepository(HealthRecord) private readonly healthRecord: Repository<HealthRecord>,
                @InjectRepository(User) private readonly user: Repository<User>,
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
            return {cnt: 0, reason: 'error while adding a health group mark', healthMarkGrpId: null};
        }
    }

    /**
     * @description 건강지표그룹 조회 (건강지표그룹 정보 필수)
     */
    async showHealthMarkGrp(showHealthMarkGrpInput: ShowHealthMarkGrpInput): Promise<ShowHealthMarkGrpOutput>{
        try {
            let rslt = await this.healthMarkGrp.find({where: showHealthMarkGrpInput});
            if(rslt) {
                return {cnt: 1, reason: 'ok', healthMarkGrp: rslt};
            } else {
                return {cnt: 0, reason: 'no health mark group found', healthMarkGrp: null};
            }
        } catch {
            return {cnt: 0, reason: 'error while searching health group marks', healthMarkGrp: null};
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
            return {cnt: 0, reason: 'error while adding a health mark', healthMarkId: null};
        }
    }

    /**
     * @description 건강지표 조회 (건강지표 정보 필수)
     */
    async showHealthMark(showHealthMarkInput: ShowHealthMarkInput): Promise<ShowHealthMarkOutput>{
        try {
            // let {ok, reason, id} = await this.checkHealthMarkGroup(showHealthMarkInput.grpMark.id);
            // if(!ok) {
            //     return {cnt: 0, reason, healthMark: null};
            // }

            let healthMark = await this.healthMark.find({where: showHealthMarkInput});
            if(healthMark) {
                return {cnt: 1, reason: 'ok', healthMark};
            } else {
                return {cnt: 0, reason: `couldn't find a health mark`, healthMark: null};
            }
        } catch {
            return {cnt: 0, reason: 'error while finding a health mark', healthMark: null};
        }
    }

    /**
     * @description 사용자 건강기록 조회
     */
    async showHealthRecord({idHealthRecord, idUser, dtRecordStart, dtRecordEnd}: ShowHealthRecordInput): Promise<ShowHealthRecordOutput> {
        try {
            if(!idHealthRecord || !idUser) {
                return {cnt: 0, reason: 'no userid or health record input', healthRecord: null}
            }
            let user = await this.user.findOne({where: {id: idUser}})
            if(!user) {
                return {cnt: 0, reason: 'no user found', healthRecord: null}
            }

            let [records, cnt] = await this.healthRecord.findAndCount({where: [{user: {id: idUser}}, {healthMark: {id: idHealthRecord}}, {dtInsert: Between(dtRecordStart, dtRecordEnd)}]})
            if(cnt == 0) {
                return {cnt: 0, reason: 'no health record found', healthRecord: null};
            }
            return {cnt, reason: 'ok', healthRecord: records};
        } catch {
            return {cnt: 0, reason: 'error while searching health record', healthRecord: null};
        }
    }
}
