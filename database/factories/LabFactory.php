<?php

namespace Database\Factories;

use App\Models\Lab;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lab>
 */
class LabFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Lab::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->bothify('LAB-###'),
            'name' => $this->faker->company . ' Laboratory',
            'name_en' => $this->faker->company . ' Laboratory',
            'description' => $this->faker->paragraph,
            'description_en' => $this->faker->paragraph,
            'website_url' => $this->faker->optional()->url,
            'email' => $this->faker->optional()->email,
            'phone' => $this->faker->optional()->phoneNumber,
            'cover_image_url' => $this->faker->optional()->imageUrl(),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'visible' => $this->faker->boolean(80), // 80% chance of being visible
        ];
    }

    /**
     * Indicate that the lab is visible.
     */
    public function visible(): static
    {
        return $this->state(fn (array $attributes) => [
            'visible' => true,
        ]);
    }

    /**
     * Indicate that the lab is hidden.
     */
    public function hidden(): static
    {
        return $this->state(fn (array $attributes) => [
            'visible' => false,
        ]);
    }
}
