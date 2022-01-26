import { GET_PRODUCT_COUNT } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // Asks the read function for those items
      // console.log(existing, args, cache);
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: GET_PRODUCT_COUNT });
      const count = data?._allProductsMeta?.count;

      // Calculate what page we are on
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If there are items AND there aren't enough items to satisfy how many were requested
      // AND we are on the last page
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      // We don't have any items so must fetch from the network
      if (items.length !== first) {
        return false;
      }

      // If there are items, return them from cache
      if (items.length) {
        return items;
      }

      return false; // Fallback to network
    },
    merge(existing, incoming, { args }) {
      // Runs when Apollo client comes back from the network
      const { skip, first } = args;
      const merged = existing ? existing.slice(0) : [];
      // eslint-disable-next-line no-plusplus
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // Return merged items from the cache
      return merged;
    },
  };
}
