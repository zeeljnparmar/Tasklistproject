import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

//INFO: Transaction isolation levels specify what data is visible to statements within a transaction.
//INFO: Specifies that statements cannot read data that has been modified but not committed by other transactions
const DEFAULT_ISOLATION_LEVEL: IsolationLevel = 'READ UNCOMMITTED';

export abstract class ITransactionRunner {
  abstract startTransaction(): Promise<void>;
  abstract commitTransaction(): Promise<void>;
  abstract rollbackTransaction(): Promise<void>;
  abstract releaseTransaction(): Promise<void>;
}


class TransactionRunner implements ITransactionRunner {
  private hasTransactionDestroyed = false;
  constructor(private readonly queryRunner: QueryRunner) {}

  //INFO: Abstraction of this reusable funtion for starting transaction
  async startTransaction(isolationLevel: IsolationLevel = DEFAULT_ISOLATION_LEVEL): Promise<void> {
    if (this.queryRunner.isTransactionActive) return;
    return this.queryRunner.startTransaction(isolationLevel);
  }

  //INFO: Abstraction of this reusable funtion for commiting transaction
  async commitTransaction(): Promise<void> {
    if (this.hasTransactionDestroyed) return;
    return this.queryRunner.commitTransaction();
  }

  //INFO: Abstraction of this reusable funtion for rolling back the transaction
  async rollbackTransaction(): Promise<void> {
    if (this.hasTransactionDestroyed) return;
    return this.queryRunner.rollbackTransaction();
  }

  //INFO: Abstraction of this reusable funtion for release the transaction
  async releaseTransaction(): Promise<void> {
    this.hasTransactionDestroyed = true;
    return this.queryRunner.release();
  }

  get transactionManager(): EntityManager {
    return this.queryRunner.manager;
  }
}

@Injectable()
//INFO: This will be the actual class which will inherit the Factory class above to function without conflicts on flight for initiating the service at every service
export class DbTransactionFactory {
  constructor(
    @InjectDataSource("user")
    private bdmDataSource: DataSource,

    ) {}

  //INFO: Abstraction of this reusable funtion for creating transaction for business data model
  async createTransaction(): Promise<TransactionRunner> {
    const queryRunner = this.bdmDataSource.createQueryRunner();
    await queryRunner.connect();
    return new TransactionRunner(queryRunner);
  }
}