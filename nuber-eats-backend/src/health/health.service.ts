import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Like, Repository, FindOptionsWhere } from 'typeorm';
import { HealthMark, HealthMarkGrp, HealthRecord } from './entities/health.entity';
import { CreateHealthMarkInput, CreateHealthMarkOutput } from './dtos/create-health-mark.dto';
import { CreateHealthMarkGrpInput, CreateHealthMarkGrpOutput } from './dtos/create-health-mark-grp.dto.';
import { FindHealthRecordInput, FindHealthRecordOutput } from './dtos/find-health-record.dto';
import { User } from 'src/users/entities/user.entity';
import { FindHealthMarkGrpInput, FindHealthMarkGrpOutput } from './dtos/find-health-mark-grp.dto';
import { FindHealthMarkInput, FindHealthMarkOutput } from './dtos/find-health-mark.dto';
import { CreateHealthRecordInput, CreateHealthRecordOutput } from './dtos/create-health-record.dto';

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
    async createHealthMarkGrp({...etc}: CreateHealthMarkGrpInput): Promise<CreateHealthMarkGrpOutput>{
        try {
            let rslt = await this.healthMarkGrp.save({...etc});
            if(rslt) {
                return {cnt: 1, reason: 'ok', idHealthMarkGrp: rslt.id};
            } else {
                return {cnt: 0, reason: `couldn't create a health group mark`, idHealthMarkGrp: rslt.id};
            }
        } catch {
            return {cnt: 0, reason: 'error while creating a health group mark', idHealthMarkGrp: null};
        }
    }

    /**
     * @description 건강지표그룹 조회 (건강지표그룹 정보 필수)
     */
    async findHealthMarkGrp({nmGrpMark, ...etc}: FindHealthMarkGrpInput): Promise<FindHealthMarkGrpOutput>{
        try {
            let rslt;
            if(!nmGrpMark || nmGrpMark.length == 0) {
                rslt = await this.healthMarkGrp.find({where: {...etc} as FindOptionsWhere<HealthMarkGrp>});
            } else {
                rslt = await this.healthMarkGrp.find({where: {...etc, nmGrpMark: ILike(`%${nmGrpMark? nmGrpMark: ''}%`)} as FindOptionsWhere<HealthMarkGrp>});
            }
            if(rslt.length) {
                return {cnt: rslt.length, reason: 'ok', healthMarkGrp: rslt};
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
        let rslt = await this.healthMarkGrp.findOne({where: {id}});
        if(!rslt) {
            return {ok: false, reason: 'no health mark group found', id: null};
        }
        return {ok: true, reason: 'ok', id: rslt.id}
    }

    /**
     * @description 건강지표 입력 (건강지표 정보 및 건강지표그룹ID 필수)
     */
    async createHealthMark({idHealthMarkGrp, ...etc}: CreateHealthMarkInput): Promise<CreateHealthMarkOutput>{
        try {
            let {ok, reason, id} = await this.checkHealthMarkGroup(idHealthMarkGrp);
            if(!ok) {
                return {cnt: 0, reason, idHealthMark: null};
            }

            let rslt = await this.healthMark.save({...etc, healthMarkGrpId: id});
            if(rslt) {
                return {cnt: 1, reason: 'ok', idHealthMark: rslt.id};
            } else {
                return {cnt: 0, reason: `couldn't create a health mark`, idHealthMark: rslt.id};
            }
        } catch {
            return {cnt: 0, reason: 'error while creating a health mark', idHealthMark: null};
        }
    }

    /**
     * @description 건강지표 조회 (건강지표 정보 필수)
     */
    async findHealthMark({nmMark, ...etc}: FindHealthMarkInput): Promise<FindHealthMarkOutput>{
        try {
            // let {ok, reason, id} = await this.checkHealthMarkGroup(showHealthMarkInput.grpMark.id);
            // if(!ok) {
            //     return {cnt: 0, reason, healthMark: null};
            // }
            let healthMark;
            if(!nmMark || nmMark.length == 0) {
                healthMark = await this.healthMark.find({where: {...etc} as FindOptionsWhere<HealthMark>});
            } else {
                healthMark = await this.healthMark.find({where: {...etc, nmMark: ILike(`%${nmMark? nmMark: ''}%`)} as FindOptionsWhere<HealthMark>});
            }
            if(healthMark.length) {
                return {cnt: healthMark.length, reason: 'ok', healthMark};
            } else {
                return {cnt: 0, reason: `couldn't find a health mark`, healthMark: null};
            }
        } catch {
            return {cnt: 0, reason: 'error while finding a health mark', healthMark: null};
        }
    }

    
    /**
     * @description 사용자 건강기록 입력
     */
    async createHealthRecord({idUser, tpRecord, idHealthMark, ...etc}: CreateHealthRecordInput): Promise<CreateHealthRecordOutput> {
        try {
            if(!tpRecord || !idUser || !idHealthMark) {
                return {cnt: 0, reason: 'no userid or record type or health mark input', idHealthRecord: null}
            }
            let healthMark = await this.healthMark.findOne({where: {id: idHealthMark}});
            if(!healthMark) {
                return {cnt: 0, reason: 'no health mark found', idHealthRecord: null}
            }
            let user = await this.user.findOne({where: {id: idUser}})
            if(!user) {
                return {cnt: 0, reason: 'no user found', idHealthRecord: null}
            }

            let record = await this.healthRecord.save(this.healthRecord.create({...etc, tpRecord, user, healthMark}))
            if(!record) {
                return {cnt: 0, reason: 'error while inserting a health record', idHealthRecord: null};
            }
            return {cnt: 1, reason: 'ok', idHealthRecord: record.id};
        } catch {
            return {cnt: 0, reason: 'error while inserting a health record', idHealthRecord: null};
        }
    }    
    /**
     * @description 사용자 건강기록 조회
     */
    async findHealthRecord({idHealthMark, idUser, dtRecordStart, dtRecordEnd}: FindHealthRecordInput): Promise<FindHealthRecordOutput> {
        try {
            if(/*!idHealthMark || */!idUser) {
                return {cnt: 0, reason: 'no userid or health record input', healthRecord: null}
            }
            let user = await this.user.findOne({where: {id: idUser}})
            if(!user) {
                return {cnt: 0, reason: 'no user found', healthRecord: null}
            }

            let condition = {};
            if(idUser) {
                condition['user'] = {'id': idUser};
            }
            if(idHealthMark) {
                condition['healthMark'] = {'id': idHealthMark}
            }
            if(dtRecordStart || dtRecordEnd) {
                condition['dtInsert'] = Between(dtRecordStart?dtRecordStart:0, dtRecordEnd?dtRecordEnd:0);
            }

            let [records, cnt] = await this.healthRecord.findAndCount({relations: ['healthMark'], where: condition})
            console.log(records);
            if(cnt == 0) {
                return {cnt: 0, reason: 'no health record found', healthRecord: null};
            }
            return {cnt, reason: 'ok', healthRecord: records};
        } catch {
            return {cnt: 0, reason: 'error while searching health record', healthRecord: null};
        }
    }
}
