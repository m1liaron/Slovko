import { type IGroup } from "@/common/enums/types/group.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as uuid } from 'uuid';

const groupApi = createApi({
    reducerPath: 'groupApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Group'],
    endpoints: (build) => ({
        getAllGroups: build.query<IGroup[], void>({
            query: () => '/groups',
            providesTags: (result = []) =>
                result.map(g => ({ type: 'Group' as const, id: g.id }))
                    .concat({ type: 'Group', id: 'LIST' }),
        }),

        addGroup: build.mutation<IGroup, Partial<IGroup>>({
            query: (newGroup) => ({
                url: '/groups',
                method: 'POST',
                body: newGroup,
            }),
            invalidatesTags: [{ type: 'Group', id: 'LIST' }],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // generate a temp ID for optimistic update
                const tempId = uuid();
                const patch = dispatch(
                    groupApi.util.updateQueryData('getAllGroups', undefined, draft => {
                        draft.push({ ...(arg as IGroup), id: tempId });
                    })
                );
                try {
                    const { data: created } = await queryFulfilled;
                    // replace temp with real
                    dispatch(
                        groupApi.util.updateQueryData('getAllGroups', undefined, draft => {
                            const idx = draft.findIndex(g => g.id === tempId);
                            if (idx !== -1) draft[idx] = created;
                        })
                    );
                } catch {
                    patch.undo();
                }
            },
        }),

        updateGroup: build.mutation<IGroup, IGroup>({
            query: (group) => ({
                url: `/groups/${group.id}`,
                method: 'PATCH',
                body: group,
            }),
            invalidatesTags: (result) =>
                result ? [{ type: 'Group', id: result.id }] : [],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // optimistic patch
                const patch = dispatch(
                    groupApi.util.updateQueryData('getAllGroups', undefined, draft => {
                        const idx = draft.findIndex(g => g.id === arg.id);
                        if (idx !== -1) draft[idx] = arg;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),

        removeGroup: build.mutation<{ id: string }, { id: string }>({
            query: ({ id }) => ({
                url: `/groups/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result) =>
                result ? [{ type: 'Group', id: result.id }] : [],
            async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    groupApi.util.updateQueryData('getAllGroups', undefined, draft => {
                        return draft.filter(g => g.id !== id);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),
    }),
});

export const {
    useGetAllGroupsQuery,
    useAddGroupMutation,
    useUpdateGroupMutation,
    useRemoveGroupMutation
} = groupApi;

export { groupApi };