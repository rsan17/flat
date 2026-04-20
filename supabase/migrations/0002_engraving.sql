-- THE BOARD · add engraving option (F5 Chess Club)
alter table orders
  add column if not exists engraving boolean not null default false,
  add column if not exists engraving_fee int not null default 0;
