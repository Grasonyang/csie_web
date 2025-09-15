<?php

return [

    /*
    |--------------------------------------------------------------------------
    | 驗證語言行
    |--------------------------------------------------------------------------
    |
    | 以下語言行包含驗證器所使用的預設錯誤訊息。某些規則有多種版本（例如大小相關規則）。
    | 如果需要，可以在此調整每則訊息。
    |
    */

    'accepted' => ':attribute 欄位必須被接受。',
    'accepted_if' => '當 :other 為 :value 時，:attribute 欄位必須被接受。',
    'active_url' => ':attribute 欄位必須是一個有效的 URL。',
    'after' => ':attribute 欄位必須為 :date 之後的日期。',
    'after_or_equal' => ':attribute 欄位必須為 :date 或之後的日期。',
    'alpha' => ':attribute 欄位只能包含字母。',
    'alpha_dash' => ':attribute 欄位只能包含字母、數字、破折號和底線。',
    'alpha_num' => ':attribute 欄位只能包含字母與數字。',
    'any_of' => ':attribute 欄位無效。',
    'array' => ':attribute 欄位必須為陣列。',
    'ascii' => ':attribute 欄位只能包含單位元組字母數字與符號。',
    'before' => ':attribute 欄位必須為 :date 之前的日期。',
    'before_or_equal' => ':attribute 欄位必須為 :date 或之前的日期。',
    'between' => [
        'array' => ':attribute 欄位的項目數必須介於 :min 至 :max 之間。',
        'file' => ':attribute 欄位的大小必須介於 :min 至 :max KB 之間。',
        'numeric' => ':attribute 欄位必須介於 :min 至 :max 之間。',
        'string' => ':attribute 欄位的字元數必須介於 :min 至 :max 之間。',
    ],
    'boolean' => ':attribute 欄位必須為 true 或 false。',
    'can' => ':attribute 欄位包含未授權的值。',
    'confirmed' => ':attribute 欄位的確認欄位不相符。',
    'contains' => ':attribute 欄位缺少必要的值。',
    'current_password' => '密碼不正確。',
    'date' => ':attribute 欄位必須為有效的日期。',
    'date_equals' => ':attribute 欄位必須為等於 :date 的日期。',
    'date_format' => ':attribute 欄位的格式必須符合 :format。',
    'decimal' => ':attribute 欄位必須有 :decimal 位小數。',
    'declined' => ':attribute 欄位必須被拒絕。',
    'declined_if' => '當 :other 為 :value 時，:attribute 欄位必須被拒絕。',
    'different' => ':attribute 與 :other 必須不同。',
    'digits' => ':attribute 欄位必須為 :digits 位數字。',
    'digits_between' => ':attribute 欄位的位數必須介於 :min 至 :max 之間。',
    'dimensions' => ':attribute 欄位的影像尺寸無效。',
    'distinct' => ':attribute 欄位有重複的值。',
    'doesnt_contain' => ':attribute 欄位不得包含以下任一值：:values。',
    'doesnt_end_with' => ':attribute 欄位不得以以下任一內容結尾：:values。',
    'doesnt_start_with' => ':attribute 欄位不得以以下任一內容開始：:values。',
    'email' => ':attribute 欄位必須為有效的電子郵件地址。',
    'ends_with' => ':attribute 欄位必須以以下其中之一開始：:values。',
    'enum' => '所選的 :attribute 無效。',
    'exists' => '所選的 :attribute 無效。',
    'extensions' => ':attribute 欄位的副檔名必須為：:values。',
    'file' => ':attribute 欄位必須為檔案。',
    'filled' => ':attribute 欄位必須有值。',
    'gt' => [
        'array' => ':attribute 欄位的項目數必須大於 :value。',
        'file' => ':attribute 欄位必須大於 :value KB。',
        'numeric' => ':attribute 欄位必須大於 :value。',
        'string' => ':attribute 欄位的字元數必須大於 :value。',
    ],
    'gte' => [
        'array' => ':attribute 欄位的項目數必須至少為 :value。',
        'file' => ':attribute 欄位必須大於或等於 :value KB。',
        'numeric' => ':attribute 欄位必須大於或等於 :value。',
        'string' => ':attribute 欄位的字元數必須大於或等於 :value。',
    ],
    'hex_color' => ':attribute 欄位必須為有效的十六進位顏色值。',
    'image' => ':attribute 欄位必須為影像檔。',
    'in' => '所選的 :attribute 無效。',
    'in_array' => ':attribute 欄位必須存在於 :other 中。',
    'in_array_keys' => ':attribute 欄位必須包含至少以下其中一個鍵：:values。',
    'integer' => ':attribute 欄位必須為整數。',
    'ip' => ':attribute 欄位必須為有效的 IP 位址。',
    'ipv4' => ':attribute 欄位必須為有效的 IPv4 位址。',
    'ipv6' => ':attribute 欄位必須為有效的 IPv6 位址。',
    'json' => ':attribute 欄位必須為有效的 JSON 字串。',
    'list' => ':attribute 欄位必須為列表。',
    'lowercase' => ':attribute 欄位必須為小寫。',
    'lt' => [
        'array' => ':attribute 欄位的項目數必須少於 :value。',
        'file' => ':attribute 欄位必須小於 :value KB。',
        'numeric' => ':attribute 欄位必須小於 :value。',
        'string' => ':attribute 欄位的字元數必須小於 :value。',
    ],
    'lte' => [
        'array' => ':attribute 欄位的項目數不得多於 :value。',
        'file' => ':attribute 欄位必須小於或等於 :value KB。',
        'numeric' => ':attribute 欄位必須小於或等於 :value。',
        'string' => ':attribute 欄位的字元數必須小於或等於 :value。',
    ],
    'mac_address' => ':attribute 欄位必須為有效的 MAC 位址。',
    'max' => [
        'array' => ':attribute 欄位的項目數不得多於 :max。',
        'file' => ':attribute 欄位不得大於 :max KB。',
        'numeric' => ':attribute 欄位不得大於 :max。',
        'string' => ':attribute 欄位不得超過 :max 個字元。',
    ],
    'max_digits' => ':attribute 欄位的數字位數不得多於 :max。',
    'mimes' => ':attribute 欄位必須為下列其中一種檔案類型：:values。',
    'mimetypes' => ':attribute 欄位必須為下列其中一種檔案類型：:values。',
    'min' => [
        'array' => ':attribute 欄位必須至少有 :min 個項目。',
        'file' => ':attribute 欄位必須至少為 :min KB。',
        'numeric' => ':attribute 欄位必須至少為 :min。',
        'string' => ':attribute 欄位必須至少有 :min 個字元。',
    ],
    'min_digits' => ':attribute 欄位的數字位數至少為 :min。',
    'missing' => ':attribute 欄位必須缺少。',
    'missing_if' => '當 :other 為 :value 時，:attribute 欄位必須缺少。',
    'missing_unless' => '除非 :other 為 :value，否則 :attribute 欄位必須缺少。',
    'missing_with' => '當 :values 出現時，:attribute 欄位必須缺少。',
    'missing_with_all' => '當 :values 都出現時，:attribute 欄位必須缺少。',
    'multiple_of' => ':attribute 欄位必須為 :value 的倍數。',
    'not_in' => '所選的 :attribute 無效。',
    'not_regex' => ':attribute 欄位的格式無效。',
    'numeric' => ':attribute 欄位必須為數字。',
    'password' => [
        'letters' => ':attribute 欄位必須至少包含一個字母。',
        'mixed' => ':attribute 欄位必須同時包含大寫和小寫字母。',
        'numbers' => ':attribute 欄位必須至少包含一個數字。',
        'symbols' => ':attribute 欄位必須至少包含一個符號。',
        'uncompromised' => '所提供的 :attribute 曾出現在資料外洩中，請選擇不同的 :attribute。',
    ],
    'present' => ':attribute 欄位必須存在。',
    'present_if' => '當 :other 為 :value 時，:attribute 欄位必須存在。',
    'present_unless' => '除非 :other 為 :value，否則 :attribute 欄位必須存在。',
    'present_with' => '當 :values 出現時，:attribute 欄位必須存在。',
    'present_with_all' => '當 :values 都出現時，:attribute 欄位必須存在。',
    'prohibited' => ':attribute 欄位被禁止。',
    'prohibited_if' => '當 :other 為 :value 時，:attribute 欄位被禁止。',
    'prohibited_if_accepted' => '當 :other 被接受時，:attribute 欄位被禁止。',
    'prohibited_if_declined' => '當 :other 被拒絕時，:attribute 欄位被禁止。',
    'prohibited_unless' => '除非 :other 在 :values 中，否則 :attribute 欄位被禁止。',
    'prohibits' => ':attribute 欄位禁止 :other 出現。',
    'regex' => ':attribute 欄位的格式無效。',
    'required' => ':attribute 欄位為必填。',
    'required_array_keys' => ':attribute 欄位必須包含對於以下項目的資料：:values。',
    'required_if' => '當 :other 為 :value 時，:attribute 欄位為必填。',
    'required_if_accepted' => '當 :other 被接受時，:attribute 欄位為必填。',
    'required_if_declined' => '當 :other 被拒絕時，:attribute 欄位為必填。',
    'required_unless' => '除非 :other 在 :values 中，否則 :attribute 欄位為必填。',
    'required_with' => '當 :values 出現時，:attribute 欄位為必填。',
    'required_with_all' => '當 :values 都出現時，:attribute 欄位為必填。',
    'required_without' => '當 :values 未出現時，:attribute 欄位為必填。',
    'required_without_all' => '當 :values 全部都未出現時，:attribute 欄位為必填。',
    'same' => ':attribute 欄位必須與 :other 相符。',
    'size' => [
        'array' => ':attribute 欄位必須包含 :size 個項目。',
        'file' => ':attribute 欄位必須為 :size KB。',
        'numeric' => ':attribute 欄位必須為 :size。',
        'string' => ':attribute 欄位必須為 :size 個字元。',
    ],
    'starts_with' => ':attribute 欄位必須以以下其中之一開始：:values。',
    'string' => ':attribute 欄位必須為字串。',
    'timezone' => ':attribute 欄位必須為有效的時區。',
    'unique' => ':attribute 已經被使用。',
    'uploaded' => ':attribute 上傳失敗。',
    'uppercase' => ':attribute 欄位必須為大寫。',
    'url' => ':attribute 欄位必須為有效的 URL。',
    'ulid' => ':attribute 欄位必須為有效的 ULID。',
    'uuid' => ':attribute 欄位必須為有效的 UUID。',

    /*
    |--------------------------------------------------------------------------
    | 自訂驗證語言行
    |--------------------------------------------------------------------------
    |
    | 你可以使用 "attribute.rule" 的格式為指定屬性定義自訂的驗證訊息。
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | 自訂屬性名稱
    |--------------------------------------------------------------------------
    |
    | 下列語言行用於將屬性佔位符替換為更易讀的名稱，例如將 "email" 換成 "電子郵件地址"。
    |
    */

    'attributes' => [],

];
