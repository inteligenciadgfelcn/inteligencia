import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginationResult } from '../interfaces/pagination-result.interface';

export async function paginateQueryBuilder<Entity extends ObjectLiteral>(
  qb: SelectQueryBuilder<Entity>,
  pagination: PaginationQueryDto,
  options?: {
    searchableColumns?: string[];
    sortableColumns?: string[];
  },
): Promise<PaginationResult<Entity>> {

  const {
    page = 1,
    pageSize = 10,
    search,
    sort,
  } = pagination;

  const skip = (page - 1) * pageSize;

  // BÚSQUEDA DINÁMICA
  if (search && options?.searchableColumns?.length) {
    const searchConditions = options.searchableColumns
      .map(column => `LOWER(${column}) LIKE LOWER(:search)`)
      .join(' OR ');

    qb.andWhere(`(${searchConditions})`, {
      search: `%${search}%`,
    });
  }

  // ORDEN DINÁMICO SEGURO
  if (sort && options?.sortableColumns?.length) {
    const [field, direction] = sort.split(':');

    if (options.sortableColumns.includes(field)) {
      qb.orderBy(
        field,
        direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );
    }
  }

  qb.skip(skip);
  qb.take(pageSize);

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}