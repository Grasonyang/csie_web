<?php

namespace Database\Factories;

use App\Models\Settings;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Settings>
 */
class SettingsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['appearance', 'notifications', 'privacy', 'localization', 'user_preferences'];
        $keys = [
            'appearance' => ['theme', 'sidebar_collapsed', 'color_scheme'],
            'notifications' => ['email_notifications', 'push_notifications', 'notification_frequency'],
            'privacy' => ['profile_visibility', 'show_email', 'allow_contact'],
            'localization' => ['language', 'timezone', 'date_format'],
            'user_preferences' => ['dashboard_layout', 'items_per_page', 'auto_save']
        ];

        $category = $this->faker->randomElement($categories);
        $key = $this->faker->randomElement($keys[$category]);

        $values = [
            'theme' => ['light', 'dark', 'auto'],
            'sidebar_collapsed' => ['true', 'false'],
            'color_scheme' => ['blue', 'green', 'purple', 'orange'],
            'email_notifications' => ['true', 'false'],
            'push_notifications' => ['true', 'false'],
            'notification_frequency' => ['immediate', 'daily', 'weekly'],
            'profile_visibility' => ['public', 'private', 'contacts_only'],
            'show_email' => ['true', 'false'],
            'allow_contact' => ['true', 'false'],
            'language' => ['en', 'zh-TW', 'zh-CN'],
            'timezone' => ['Asia/Taipei', 'UTC', 'America/New_York'],
            'date_format' => ['Y-m-d', 'd/m/Y', 'm/d/Y'],
            'dashboard_layout' => ['grid', 'list', 'cards'],
            'items_per_page' => ['10', '25', '50', '100'],
            'auto_save' => ['true', 'false']
        ];

        return [
            'user_id' => User::factory(),
            'key' => $key,
            'value' => $this->faker->randomElement($values[$key] ?? ['true', 'false']),
            'category' => $category,
            'is_public' => $this->faker->boolean(20),
            'metadata' => $this->faker->optional(30)->passthrough([
                'description' => $this->faker->sentence(),
                'options' => $values[$key] ?? ['true', 'false'],
                'created_by' => 'system'
            ]),
        ];
    }

    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }

    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => false,
        ]);
    }

    public function inCategory(string $category): static
    {
        $keys = [
            'appearance' => ['theme', 'sidebar_collapsed', 'color_scheme'],
            'notifications' => ['email_notifications', 'push_notifications'],
            'privacy' => ['profile_visibility', 'show_email'],
            'localization' => ['language', 'timezone'],
            'user_preferences' => ['dashboard_layout', 'items_per_page']
        ];

        return $this->state(fn (array $attributes) => [
            'category' => $category,
            'key' => $this->faker->randomElement($keys[$category] ?? ['setting']),
        ]);
    }

    public function keyValue(string $key, string $value): static
    {
        return $this->state(fn (array $attributes) => [
            'key' => $key,
            'value' => $value,
        ]);
    }
}
