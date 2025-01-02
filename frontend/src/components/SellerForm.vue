<template>
    <v-dialog v-model="isAddNewSeller" max-width="500px">
        <v-card>
            <v-card-title v-if="isSellerNameVisible" class="headline">Создание нового продавца</v-card-title>

            <v-card-title v-if="!isSellerNameVisible" class="headline">Добавление продавца</v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <!-- Кнопка для отображения поля ввода имени продавца -->
                            <v-btn v-if="!isSellerNameVisible" @click="toggleSellerNameVisible" class="work-button">
                                Создать нового продавца
                            </v-btn>

                            <!-- Кнопка для возврата к выпадающему списку -->
                            <v-btn v-if="isSellerNameVisible" @click="toggleSellerNameVisible" class="work-button">
                                Выбрать продавца из списка
                            </v-btn>

                            <!-- Поле для ввода имени продавца, если кнопка нажата -->
                            <v-text-field v-if="isSellerNameVisible" v-model="sellerName" class="work-label"
                                label="Имя продавца" @input="handleSellerInputChange" hide-details>
                            </v-text-field>

                            <v-autocomplete v-if="!isSellerNameVisible" dense v-model="selectedSeller"
                                :items="filteredSellers" class="custom-autocomplete" label="Выберите продавца из списка"
                                item-title="name" item-value="value" no-data-text="Нет данных"
                                :menu-props="{ maxHeight: '400' }" hide-details @update:model-value="handleSellerChange"
                                allow-overflow :search-input="searchInput" @input="onInput"
                                variant="outlined"></v-autocomplete>

                            <v-alert v-if="isError" class="alert-spacing" density="compact" :text="alertText"
                                type="warning"></v-alert>

                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <!-- Кнопки: Добавить и Отмена -->
                <v-btn class="work-button" @click="addSeller"> Добавить </v-btn>
                <v-btn text class="work-button" @click="handleCancel"> Отмена </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script setup>
import { useStore } from '@/stores/store';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const store = useStore();

const isAddNewSeller = computed({
    get: () => store.isAddNewSeller,
    set: (value) => {
        store.isAddNewSeller = value;
    },
});

const filteredSellers = computed({
    get: () => store.filteredSellers,
    set: (value) => {
        store.filteredSellers = value;
    },
});

// eslint-disable-next-line
const workingSellers = computed({
    get: () => store.workingSellers,
    set: (value) => {
        store.workingSellers = value;
    },
});

const pinnedSellers = computed({
    get: () => store.pinnedSellers,
    set: (value) => {
        store.pinnedSellers = value;
    },
});

const isSellerNameVisible = ref(false); // Флаг для отображения поля имени продавца
const sellerName = ref(''); // Имя продавца
const searchInput = ref('');
const sellerLabel = ref('');
const selectedSeller = ref(null); // Выбранный продавец из списка

const isError = ref(false);
let alertText = '';


const onInput = (value) => {
    searchInput.value = value;
    isError.value = false;
    alertText = '';
};

const handleSellerChange = (value) => {
    isError.value = false;
    alertText = '';
    sellerLabel.value = value;
};

const handleCancel = () => {
    store.isAddNewSeller = false;
    isError.value = false;
    alertText = '';
    selectedSeller.value = null;
    sellerLabel.value = null;
    sellerName.value = "";
}

// проверка на не выбранного продавца
// fetchsellers должен работать с workingSellers
// Изменить удаление продавца (должен удаляться только из списка не из базы)

const addSeller = async () => {
    if (isSellerNameVisible.value) {
        // Создание нового продавца
        const sellerExists = filteredSellers.value.some(seller => seller.name === sellerName.value);
        if (sellerExists) {
            isError.value = true;
            alertText = "Продавец с таким именем уже существует!";
            return;
        } else {
            const userID = localStorage.getItem('id');
            if (!sellerName.value) {
                isError.value = true;
                alertText = "Введите имя продавца!";
                return;
            }
            const newSeller = {
                name: sellerName.value,
                user_id: userID,
                schedule: [],
                result: [],
            };
            filteredSellers.value.push({ ...newSeller }); // Создаем копию
            console.log(newSeller);
            const savedSeller = await saveSeller(newSeller);
            workingSellers.value = [...workingSellers.value, { ...savedSeller }]; // Копия сохраненного продавца
            isSellerNameVisible.value = false;
            return;
        }
    } else {
        // Добавление в таблицу созданного ранее продавца
        const existingSeller = pinnedSellers.value.find(seller => seller.name === sellerLabel.value);
        if (existingSeller) {
            isError.value = true;
            alertText = "Этот продавец уже добавлен в таблицу!";
            return;
        } else {
            const seller = await getSellerByName(sellerLabel.value);
            if (!seller) {
                isError.value = true;
                alertText = "Выберите продавца из списка!";
                return;
            }
            const date = new Date(Date.UTC(store.selectedYear, store.selectedMonth, 1));
            const formattedDate = date.toISOString().split('T')[0];
            const userID = localStorage.getItem('id');
            const pinnedStoreShift = { date: formattedDate, user_id: userID };

            // Создаем копию продавца для текущего магазина
            const newSeller = {
                _id: seller._id,
                name: seller.name,
                user_id: seller.user_id,
                schedule: [...seller.schedule, pinnedStoreShift], // Копируем расписание
                result: [...seller.result], // Копируем результат
            };

            const updatingSeller = workingSellers.value.find(findSeller =>
                findSeller._id === newSeller._id
            );

            updatingSeller.schedule.push(pinnedStoreShift);
            await store.fetchPinnedSellers();
            //pinnedSellers.value = store.filterPinnedSellers(workingSellers.value, userID);

            updateSellerSchedule(updatingSeller); // Обновляем расписание (если требуется)
            // вместо добавления в pinnedSellers сдеать фильтрацию как filterPinnedSellers
    
            //store.pinnedSellers.push({ ...newSeller }); // Добавляем копию в pinnedSellers
        }
    }
    store.isAddNewSeller = false;
};


const updateSellerSchedule = async (seller) => {
    try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`, seller);
    } catch (error) {
        console.error('Ошибка при обновлении расписания:', error);
    }
};

const getSellerByName = async (name) => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`);
        if (response.data && Array.isArray(response.data)) {
            const seller = response.data.find(item => item.name === name);
            return seller || null; // 
        } else {
            console.error('Неверный формат ответа от сервера');
            return null;
        }
    } catch (error) {
        console.error('Ошибка при запросе данных:', error);
        return null;
    }
}

// Добавить нового продавца в базу данных
const saveSeller = async (newSeller) => {
    try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/sellers`, newSeller);
        return response.data;
    } catch (error) {
        console.error('Ошибка при добавлении продавца:', error);
    }
};

const handleSellerInputChange = () => {
    isError.value = false;
    alertText = '';
};

const toggleSellerNameVisible = () => {
    isSellerNameVisible.value = !isSellerNameVisible.value;
    sellerName.value = "";
    selectedSeller.value = null;
    sellerLabel.value = null;
    alertText = '';
}

onMounted(() => {

});

</script>

<style scoped>
.work-label {
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 2rem;
    height: 20px !important;
}

.work-button {
    color: #413E4F;
    border-radius: 20px;
    /* Закругление углов */
    box-shadow: none;
    margin-bottom: 10px;
}

.alert-spacing {
    margin-top: 56px;
    /* Задаёт расстояние сверху */
}

.custom-autocomplete {
    min-height: 16px !important;
    height: 10px !important;
}

.custom-autocomplete .v-input {
    height: 26px !important;
    /* Задайте нужную высоту */
    font-size: 4px !important;
    /* Уменьшите размер шрифта */
}

.custom-autocomplete .v-input__control {
    min-height: 26px !important;
    /* Минимальная высота */
}
</style>