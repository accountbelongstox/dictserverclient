import graphQLClient from '../utils/graphql/GraphQLClient';
import * as DictTypes from '../constants/types/dict';
import { GraphQLResult } from '../constants/types';

const sortByByMap = (groupMap: number[][]): number[][] => {
  groupMap.sort((a, b) => a[1] - b[1]);
  return groupMap;
};


export async function getGroups(pageSize = 20) {
  const query = `
    query GetGroups($pageSize: Int!) {
      dictiongroups(pagination: { pageSize: $pageSize }) {
        data {
          id
          attributes {
            name
            namespace
            wlink
            publishedAt
            wcount
          }
        }
      }
    }`;
    const result: GraphQLResult = await graphQLClient.exec(query, { pageSize });
    let formattedData = [];
    if (result.success) {
      const data = result.data;
      if (data && data.dictiongroups) {
        formattedData = data.dictiongroups.data;
      }
      return {
        success: true,
        message: result.message,
        data: formattedData,
        consumption_time: result.consumption_time, 
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to fetch groups.',
        consumption_time: result.consumption_time, 
      };
    }
}

export const getDictionGroupMapsByUid = async (uid: string) => {
  const query = `
    query GetDictionGroupMapsByUid($uid: Int!) {
      dictiongroupmaps(
        filters: { uid: { eq: $uid } },
        publicationState: LIVE
      ) {
        data {
          id
          uid
          gid
          group_map
          createdAt
          updatedAt
          publishedAt
        }
      }
    }
  `;

  const variables = { uid };
  const { data } = await graphQLClient.exec(query, variables);
  return data;
};

export const fetchDictionaries = async (input: string, mode = 'word', valid = true) => {
  const validFilter = valid ? `{ is_delete: { eq: false } },` : ``;
  let filterCondition, inputType;

  switch (mode) {
    case 'word':
      inputType = `String`;
      filterCondition = `{ word: { in: $input } }`;
      break;
    case 'id':
      inputType = `ID`;
      filterCondition = `{ id: { in: $input } }`;
      break;
    default:
      console.error('Invalid mode. Use either "word" or "id"');
      return;
  }

  const query = `
    query GetDictionaries($input: [${inputType}!], $pagination: PaginationArg) {
      dictionaries(
        filters: {
          and: [
            ${validFilter}
            ${filterCondition}
          ]
        },
        pagination: $pagination
      ) {
        data {
          id
          attributes {
            word
            is_delete
            word_sort
            phonetic_us
            phonetic_us_sort
            phonetic_us_length
            phonetic_uk
            phonetic_uk_sort
            phonetic_uk_length
            word_length
            translation
          }
        }
      }
    }
  `;

  const pagination = {
    limit: input.length
  };
  const variables = {
    input,
    pagination
  };

  const { data } = await graphQLClient.exec(query, variables);
  return data;
};


export const fetchDictionariesByStartLimit = async (start: number, limit: number) => {
  const query = `
    query GetDictionaries($start: Int!, $limit: Int!) {
      dictionaries(
        pagination: { start: $start, limit: $limit },
        publicationState: LIVE,
        sort: ["updatedAt:asc"]
      ) {
        data {
          id
          attributes {
            word
          }
        }
      }
    }
  `;

  const variables = { start, limit };

  const { data } = await graphQLClient.exec(query, variables);
  return data;
};

export const fetchDictionGroupMap = async (uid: string) => {
  const query = `
    query GetDictionGroupMap($uid: Int!) {
      dictiongroupmaps(
        filters: {
          uid: { eq: $uid }
        }
      ) {
        data {
          id
          attributes {
            uid
            group_map
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  const variables = {
    uid: parseInt(uid, 10)
  };

  const { data } = await graphQLClient.exec(query, variables);
  return data;
};

export const createDictionGroupMap = async (uid: string, gInfo: DictTypes.GroupInfo) => {
  const newGroupMap: number[][] = gInfo.attributes.wlink.map((id: number) => {
    return [id, 0, 0];
  });

  const mutation = `
    mutation CreateDictionGroupMap($uid: Int, $group_map: JSON, $publishedAt: DateTime) {
      createDictiongroupmap(
        data: {
          uid: $uid,
          group_map: $group_map,
          publishedAt: $publishedAt
        }
      ) {
        data {
          id
          attributes {
            uid
            group_map
            updatedAt
          }
        }
      }
    }
  `;

  const variables = {
    uid: parseInt(uid, 10),
    group_map: newGroupMap,
    publishedAt: new Date().toISOString(),
  };

  const { data } = await graphQLClient.exec(mutation, variables);
  return data;
};

export const updateDictionGroupMap = async (id: string, oldWlink: number[][], newWlink: number[] = []) => {
  let newGroupMap: number[][] = newWlink.map((id: number) => {
    return [id, 0, 0];
  });

  newGroupMap = [...oldWlink, ...newGroupMap];
  newGroupMap = sortByByMap(newGroupMap);
  const mutation = `
    mutation UpdateDictionGroupMap($id: ID!, $group_map: JSON) {
      updateDictiongroupmap(
        id: $id,
        data: {
          group_map: $group_map
        }
      ) {
        data {
          id
          attributes {
            uid
            group_map
            updatedAt
          }
        }
      }
    }
  `;
  const variables = {
    id,
    group_map: newGroupMap,
  };

  const { data } = await graphQLClient.exec(mutation, variables);
  return data;
};