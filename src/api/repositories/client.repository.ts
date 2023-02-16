import { Client, ClientType } from '@app/entities/client.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class ClientRepository extends EntityRepository<Client> {
  async findClientsByFilters({
    name,
    clientType,
    cityId,
  }: {
    name: string;
    clientType: ClientType;
    cityId: number;
  }) {
    return this._em.execute<{ client_id: string }[]>(
      `select * from "client" c 
        inner join "user" u 
          on 
            c.user_id = u.id 
            and u.city_id = ${cityId}
        inner join user_settings us 
          on 
            c.client_type = '${clientType}' 
            and u.settings_id = us.id 
            and (
                array_length(us.filters, 1) is null
                or '${name}' like any (us.filters)
              );`,
    );
  }
}
