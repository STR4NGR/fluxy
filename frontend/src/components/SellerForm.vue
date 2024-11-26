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
                                label="Имя продавца" @input="handleSellerInputChange" hide-details></v-text-field>

                            <v-alert v-if="isErrorNewSeller" density="compact"
                                text="Продавец с таким именем уже существует!" type="warning"></v-alert>

                            <v-autocomplete v-if="!isSellerNameVisible" v-model="selectedSeller" class="work-label"
                                :items="filteredSellers" label="Выберите продавца из списка" item-title="name"
                                item-value="value" no-data-text="Нет данных" :menu-props="{ maxHeight: '400' }"
                                hide-details @update:model-value="handleSellerChange" allow-overflow
                                :search-input="searchInput" @input="onInput" variant="outlined"></v-autocomplete>

                            <v-alert v-if="isErrorExistSeller" density="compact"
                                text="Этот продавец уже добавлен в таблицу!" type="warning"></v-alert>

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
import { ref, computed } from 'vue';
import axios from 'axios';

const store = useStore();
const selectedMonth = store.selectedMonth;
const sellers = store.sellers;
const filteredSellers = computed({
    get: () => store.filteredSellers
})
const isAddNewSeller = computed({
  get: () => store.isAddNewSeller,
  set: (value) => {
    store.isAddNewSeller = value;
  },
});

const isSellerNameVisible = ref(false); // Флаг для отображения поля имени продавца
const isErrorExistSeller = ref(false); // Флаг ошибки при добавлении продавца
const isErrorNewSeller = ref(false); // Флаг ошибки при создании продавца
const sellerName = ref(''); // Имя продавца
const searchInput = ref('');
const sellerLabel = ref('');
const selectedSeller = ref(null); // Выбранный продавец из списка

const onInput = (value) => {
    searchInput.value = value;
    isErrorExistSeller.value = false;
};

const handleSellerChange = (value) => {
    isErrorExistSeller.value = false;
    isErrorNewSeller.value = false;
    sellerLabel.value = value;
};

const handleCancel = () => {
    store.isAddNewSeller = false;
    isErrorExistSeller.value = false;
    isErrorNewSeller.value = false
}

// проверка на не выбранного продавца
// sellers изменить на store.sellers или сразу разбить на 2 разных sellers
// fetchsellers должен работать с workingSellers
// Изменить удаление продавца (должен удаляться только из списка не из базы)

const addSeller = async () => {
    if (isSellerNameVisible.value) {
        const sellerExists = filteredSellers.value.some(seller => seller.name === sellerName.value);
        if (sellerExists) {
            isErrorNewSeller.value = true;
            return
        } else {
            const userID = localStorage.getItem('id');
            const newSeller = {
                name: sellerName.value,
                user_id: userID,
                schedule: [],
                result: {
                    month: String(selectedMonth.value),
                    total_hours: 0,
                    total_shifts: 0,
                    points_57: 0,
                    points_1517: 0,
                    points_2527: 0,
                    points_yamarket: 0,
                    points_ozonmarket: 0
                }
            };
            store.filteredSellers.push(newSeller);
            await saveSeller(newSeller);
            isSellerNameVisible.value = false;
            return;
        }
    } else {
        const existingSeller = sellers.find(seller => seller._id === sellerLabel.value);
        if (existingSeller) {
            isErrorExistSeller.value = true;
            return;
        } else {
            const seller = await getSellerByName(sellerLabel.value)
            const newSeller = {
                name: seller.name,
                user_id: seller.user_id,
                schedule: seller.schedule,
                result: seller.result
            };
            store.sellers.push(newSeller);

        }
    }
    store.isAddNewSeller = false;
};

const getSellerByName = async (name) => {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/sellers`, {
            params: {
                userID: localStorage.getItem('id')
            }
        });
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
        axios.post(`${process.env.VUE_APP_API_URL}/api/sellers`, newSeller);
    } catch (error) {
        console.error('Ошибка при добавлении продавца:', error);
    }
};

const handleSellerInputChange = () => {
    isErrorNewSeller.value = false;
};

const toggleSellerNameVisible = () => {
    isSellerNameVisible.value = !isSellerNameVisible.value;
}

</script>

<style scoped>
.work-label {
    margin-bottom: 10px;
}

.work-button {
    color: #413E4F;
    border-radius: 20px;
    /* Закругление углов */
    box-shadow: none;
    margin-bottom: 10px;
}
</style>