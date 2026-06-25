import database from '../../lib/db.js';

export function list(){
    const result = database.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
    return result;
}

export function getById(id){
    const result = database.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    return result;
}

export function create(data){
    const params = {
        company: data.company,
        position: data.position,
        status: data.status ?? 'WISHLIST',
        location: data.location ?? null,
        notes: data.notes ?? null
    }

    const result = database.prepare('INSERT INTO applications (company, position, status, location, notes) VALUES (@company, @position, @status, @location, @notes) RETURNING *').get(params);
    return result;
}

export function update(id, data){
    const existing = getById(id);
    if (!existing) return undefined;

    const merged = {...existing, ...data,
                    id: id
    };

    const params = {
        company: merged.company,
        position: merged.position,
        status: merged.status,
        location: merged.location,
        notes: merged.notes,
        id
    }

    const result = database.prepare('UPDATE applications SET company = @company, position = @position, status = @status, location = @location, notes = @notes, updated_at = CURRENT_TIMESTAMP WHERE id = @id RETURNING *').get(params);
    return result;
}

export function remove(id){
    const result = database.prepare('DELETE FROM applications WHERE id = ?').run(id);
    return result.changes === 0;
}