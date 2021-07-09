import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo we will take care of everything
    read(existing = [], { args, cache }) {
      //   console.log(existing, args, cache);
      const { skip, first } = args;

      // Read number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If there are items and aren't enough items
      // to satisfy how many were requested
      // AND we are on the last page
      // Just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // Means we have no items and need to go to network for them
        return false;
      }

      // If there are items, then return cache and don't go to the network
      if (items.length) {
        return items;
      }
      return false; // fallback  to network
      // First asks the read function for the items
      // We can:
      // Return the items because theyre already in the cache
      // Or, we can return false from here, (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;

      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },

    // This runs when the Apollo client comes back from the network
    // with our product
  };
}
