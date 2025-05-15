import { Transform } from 'class-transformer';

export function TransformCommaSeparated() {
  return Transform(({ value }) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    let items: string[] = [];

    if (typeof value === 'string') {
      items = value
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    } else if (Array.isArray(value)) {
      items = value;
    } else {
      return [];
    }

    return items;
  });
}
