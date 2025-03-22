import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {getUsers, createUser, updateUser, deleteUser, getUsersTable} from '../services/usersService';

// Async actions
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return await getUsers();
});

export const fetchUsersTable = createAsyncThunk('users/fetchUsersTable', async () => {
    return await getUsersTable();
});

export const addUser = createAsyncThunk('users/addUser', async (product) => {
    return await createUser(product);
});

export const editUser = createAsyncThunk('users/editUser', async ({id, product}) => {
    return await updateUser(id, product);
});

export const removeUser = createAsyncThunk('users/removeUser', async (id) => {
    await deleteUser(id);
    return id;
});

// Slice definition
const usersSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsersTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsersTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUsersTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.list = state.list.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                );
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.list = state.list.filter((product) => product.id !== action.payload);
            });
    },
});

export const usersSelector = createSelector(
    (state) => state.users.list,
    (list) => list,
);

export default usersSlice.reducer;
