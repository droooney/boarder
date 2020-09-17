import gulp from 'gulp';
import run from 'gulp-run';

export function dbMigrationCreate() {
  return run('sequelize migration:create').exec();
}

export function dbMigrate() {
  return run('sequelize db:migrate').exec();
}

export function dbMigrationUndo() {
  return run('sequelize db:migrate:undo').exec();
}

export function dbMigrationUndoAll() {
  return run('sequelize db:migrate:undo:all').exec();
}

export function dbSeedCreate() {
  return run('sequelize seed:create').exec();
}

export function dbSeed() {
  return run('sequelize db:seed:all').exec();
}

export const dbSeedRerun = gulp.series(dbSeedUndoAll, dbSeed);

export function dbSeedUndoAll() {
  return run('sequelize db:seed:undo:all').exec();
}

export function dbCreate() {
  return run('sequelize db:create --debug').exec();
}

export const dbReset = gulp.series(dbDrop, dbCreate, dbMigrate, dbSeed);

export const dbResetContent = gulp.series(dbMigrationUndoAll, dbMigrate, dbSeed);

export function dbDrop() {
  return run('sequelize db:drop --debug').exec();
}
