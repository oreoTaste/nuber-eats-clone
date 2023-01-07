import { AfterInsert, BeforeInsert, Table } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies/snake-naming.strategy';

export class MySnakeNamingStrategy extends SnakeNamingStrategy {
    private cntTableForeignKey: Map<string, number>;
    private cnt: number;
    constructor() {
        super();
        this.cntTableForeignKey = new Map();
        this.cnt = 0;
    }
    tableName(className, customName) {
        return super.tableName(className, customName).toUpperCase();
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return super.columnName(propertyName, customName, embeddedPrefixes).toUpperCase();
    }
    relationName(propertyName) {
        return super.relationName(propertyName).toUpperCase();
    }
    joinColumnName(relationName, referencedColumnName) {
        let splitted = super.joinColumnName(relationName, referencedColumnName).toUpperCase().split('_');
        return splitted[splitted.length-1] + '_' + splitted.slice(0, splitted.length-1).join('_');
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName) {
        return super.joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName).toUpperCase();
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return super.joinTableColumnName(tableName, propertyName, columnName).toUpperCase();
    }
    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
        return super.classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName).toUpperCase();
    }
    eagerJoinRelationAlias(alias, propertyPath) {
        return super.eagerJoinRelationAlias(alias, propertyPath).toUpperCase();
    }
    foreignKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath?: string, referencedColumnNames?: string[]): string {
        tableOrName = typeof tableOrName === "string" ? tableOrName : tableOrName.name;
        this.cntTableForeignKey.set(tableOrName, (this.cntTableForeignKey.get(tableOrName) | 0) + 1); 
        return`FK_${tableOrName}_${Math.floor(this.cntTableForeignKey.get(tableOrName)/2)}`;
    }
}