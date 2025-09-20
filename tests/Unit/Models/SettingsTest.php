<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Settings;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Settings model can be created
     */
    public function test_settings_can_be_created(): void
    {
        $user = User::factory()->create();

        $settingsData = [
            'user_id' => $user->id,
            'key' => 'theme',
            'value' => 'dark',
            'category' => 'appearance',
            'is_public' => false,
        ];

        $settings = Settings::create($settingsData);

        $this->assertInstanceOf(Settings::class, $settings);
        $this->assertEquals($settingsData['user_id'], $settings->user_id);
        $this->assertEquals($settingsData['key'], $settings->key);
        $this->assertEquals($settingsData['value'], $settings->value);
        $this->assertEquals($settingsData['category'], $settings->category);
        $this->assertFalse($settings->is_public);
    }

    /**
     * Test Settings belongs to User relationship
     */
    public function test_settings_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $settings = Settings::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $settings->user);
        $this->assertEquals($user->id, $settings->user->id);
    }

    /**
     * Test User has many Settings relationship
     */
    public function test_user_has_many_settings(): void
    {
        $user = User::factory()->create();
        $setting1 = Settings::factory()->create(['user_id' => $user->id, 'key' => 'theme']);
        $setting2 = Settings::factory()->create(['user_id' => $user->id, 'key' => 'language']);

        $userSettings = $user->settings;

        $this->assertCount(2, $userSettings);
        $this->assertTrue($userSettings->contains($setting1));
        $this->assertTrue($userSettings->contains($setting2));
    }

    /**
     * Test Settings key-value uniqueness per user
     */
    public function test_settings_key_uniqueness_per_user(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Same key for different users should be allowed
        $setting1 = Settings::factory()->create([
            'user_id' => $user1->id,
            'key' => 'theme',
            'value' => 'dark'
        ]);
        $setting2 = Settings::factory()->create([
            'user_id' => $user2->id,
            'key' => 'theme',
            'value' => 'light'
        ]);

        $this->assertNotNull($setting1->fresh());
        $this->assertNotNull($setting2->fresh());

        // Duplicate key for same user should fail
        $this->expectException(\Illuminate\Database\QueryException::class);
        Settings::create([
            'user_id' => $user1->id,
            'key' => 'theme',
            'value' => 'light'
        ]);
    }

    /**
     * Test Settings scope for public settings
     */
    public function test_public_scope(): void
    {
        $publicSetting = Settings::factory()->create(['is_public' => true]);
        $privateSetting = Settings::factory()->create(['is_public' => false]);

        $publicSettings = Settings::public()->get();

        $this->assertCount(1, $publicSettings);
        $this->assertTrue($publicSettings->contains($publicSetting));
        $this->assertFalse($publicSettings->contains($privateSetting));
    }

    /**
     * Test Settings scope for specific category
     */
    public function test_category_scope(): void
    {
        $appearanceSetting = Settings::factory()->create(['category' => 'appearance']);
        $notificationSetting = Settings::factory()->create(['category' => 'notifications']);
        $privacySetting = Settings::factory()->create(['category' => 'privacy']);

        $appearanceSettings = Settings::inCategory('appearance')->get();

        $this->assertCount(1, $appearanceSettings);
        $this->assertTrue($appearanceSettings->contains($appearanceSetting));
        $this->assertFalse($appearanceSettings->contains($notificationSetting));
        $this->assertFalse($appearanceSettings->contains($privacySetting));
    }

    /**
     * Test Settings scope for user settings
     */
    public function test_for_user_scope(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $user1Setting = Settings::factory()->create(['user_id' => $user1->id]);
        $user2Setting = Settings::factory()->create(['user_id' => $user2->id]);

        $user1Settings = Settings::forUser($user1->id)->get();

        $this->assertCount(1, $user1Settings);
        $this->assertTrue($user1Settings->contains($user1Setting));
        $this->assertFalse($user1Settings->contains($user2Setting));
    }

    /**
     * Test Settings fillable attributes
     */
    public function test_fillable_attributes(): void
    {
        $settings = new Settings();
        $expected = [
            'user_id',
            'key',
            'value',
            'category',
            'is_public',
            'metadata'
        ];

        $this->assertEquals($expected, $settings->getFillable());
    }

    /**
     * Test Settings casts
     */
    public function test_casts(): void
    {
        $settings = new Settings();
        $casts = $settings->getCasts();

        $this->assertArrayHasKey('is_public', $casts);
        $this->assertEquals('boolean', $casts['is_public']);
        $this->assertArrayHasKey('metadata', $casts);
        $this->assertEquals('array', $casts['metadata']);
    }

    /**
     * Test Settings helper method for getting user setting
     */
    public function test_get_user_setting_helper(): void
    {
        $user = User::factory()->create();
        $setting = Settings::factory()->create([
            'user_id' => $user->id,
            'key' => 'theme',
            'value' => 'dark'
        ]);

        $value = Settings::getUserSetting($user->id, 'theme');
        $this->assertEquals('dark', $value);

        // Test default value when setting doesn't exist
        $defaultValue = Settings::getUserSetting($user->id, 'nonexistent', 'default');
        $this->assertEquals('default', $defaultValue);
    }

    /**
     * Test Settings helper method for setting user setting
     */
    public function test_set_user_setting_helper(): void
    {
        $user = User::factory()->create();

        // Create new setting
        $result = Settings::setUserSetting($user->id, 'theme', 'dark', 'appearance');
        $this->assertTrue($result);

        $setting = Settings::where('user_id', $user->id)
                          ->where('key', 'theme')
                          ->first();

        $this->assertNotNull($setting);
        $this->assertEquals('dark', $setting->value);
        $this->assertEquals('appearance', $setting->category);

        // Update existing setting
        $result = Settings::setUserSetting($user->id, 'theme', 'light');
        $this->assertTrue($result);

        $updatedSetting = $setting->fresh();
        $this->assertEquals('light', $updatedSetting->value);
    }

    /**
     * Test Settings bulk operations for user
     */
    public function test_bulk_settings_operations(): void
    {
        $user = User::factory()->create();

        $bulkSettings = [
            'theme' => 'dark',
            'language' => 'en',
            'notifications' => 'true'
        ];

        $result = Settings::setBulkUserSettings($user->id, $bulkSettings, 'user_preferences');

        $this->assertTrue($result);

        foreach ($bulkSettings as $key => $value) {
            $setting = Settings::where('user_id', $user->id)
                              ->where('key', $key)
                              ->first();

            $this->assertNotNull($setting);
            $this->assertEquals($value, $setting->value);
            $this->assertEquals('user_preferences', $setting->category);
        }
    }

    /**
     * Test Settings with metadata
     */
    public function test_settings_with_metadata(): void
    {
        $user = User::factory()->create();
        $metadata = [
            'created_by' => 'system',
            'last_updated' => now()->toISOString(),
            'options' => ['dark', 'light', 'auto']
        ];

        $setting = Settings::create([
            'user_id' => $user->id,
            'key' => 'theme',
            'value' => 'dark',
            'category' => 'appearance',
            'metadata' => $metadata
        ]);

        $this->assertEquals($metadata, $setting->metadata);
        $this->assertEquals('system', $setting->metadata['created_by']);
        $this->assertIsArray($setting->metadata['options']);
    }

    /**
     * Test Settings role-based access
     */
    public function test_role_based_settings_access(): void
    {
        $adminUser = User::factory()->create(['role' => 'admin']);
        $teacherUser = User::factory()->create(['role' => 'teacher']);
        $regularUser = User::factory()->create(['role' => 'user']);

        // Admin settings
        $adminSetting = Settings::factory()->create([
            'user_id' => $adminUser->id,
            'key' => 'admin_panel_theme',
            'category' => 'admin'
        ]);

        // Teacher settings
        $teacherSetting = Settings::factory()->create([
            'user_id' => $teacherUser->id,
            'key' => 'class_management_view',
            'category' => 'teacher'
        ]);

        // Regular user settings
        $userSetting = Settings::factory()->create([
            'user_id' => $regularUser->id,
            'key' => 'profile_visibility',
            'category' => 'user'
        ]);

        // Test admin can access admin settings
        $adminSettings = Settings::accessibleBy($adminUser)->inCategory('admin')->get();
        $this->assertTrue($adminSettings->contains($adminSetting));

        // Test teacher can access teacher settings
        $teacherSettings = Settings::accessibleBy($teacherUser)->inCategory('teacher')->get();
        $this->assertTrue($teacherSettings->contains($teacherSetting));

        // Test regular user cannot access admin/teacher settings
        $userAccessibleSettings = Settings::accessibleBy($regularUser)->get();
        $this->assertFalse($userAccessibleSettings->contains($adminSetting));
        $this->assertFalse($userAccessibleSettings->contains($teacherSetting));
        $this->assertTrue($userAccessibleSettings->contains($userSetting));
    }

    /**
     * Test Settings export/import functionality
     */
    public function test_settings_export_import(): void
    {
        $user = User::factory()->create();

        // Create multiple settings
        $settings = [
            ['key' => 'theme', 'value' => 'dark', 'category' => 'appearance'],
            ['key' => 'language', 'value' => 'en', 'category' => 'localization'],
            ['key' => 'notifications', 'value' => 'true', 'category' => 'preferences']
        ];

        foreach ($settings as $setting) {
            Settings::create(array_merge($setting, ['user_id' => $user->id]));
        }

        // Export settings
        $exportedSettings = Settings::exportUserSettings($user->id);

        $this->assertIsArray($exportedSettings);
        $this->assertCount(3, $exportedSettings);

        // Import settings to another user
        $newUser = User::factory()->create();
        $result = Settings::importUserSettings($newUser->id, $exportedSettings);

        $this->assertTrue($result);

        $importedSettings = Settings::forUser($newUser->id)->get();
        $this->assertCount(3, $importedSettings);

        foreach ($settings as $expectedSetting) {
            $imported = $importedSettings->where('key', $expectedSetting['key'])->first();
            $this->assertNotNull($imported);
            $this->assertEquals($expectedSetting['value'], $imported->value);
            $this->assertEquals($expectedSetting['category'], $imported->category);
        }
    }
}
