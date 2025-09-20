<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => PostCategory::factory(),
            'title' => $this->faker->sentence(),
            'title_en' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(3, true),
            'content_en' => $this->faker->paragraphs(3, true),
            'slug' => $this->faker->slug(),
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'source_type' => 'manual',
            'pinned' => false,
            'publish_at' => now(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'publish_at' => now(),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'publish_at' => null,
        ]);
    }
}
