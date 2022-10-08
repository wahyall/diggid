<?php

namespace App\Console\Commands\Search;

use Illuminate\Console\Command;
use MeiliSearch\Exceptions\ApiException;
use MeiliSearch\Client;

class SetupSearchSorts extends Command {
    protected $signature = 'scout:sorts
        {index : The index you want to work with.}
    ';
    protected $description = 'Register sorts against a search index.';
    public function handle(Client $client): int {
        $index = $this->argument(
            key: 'index',
        );
        $model = match ($index) {
            'courses' => \App\Models\Course::class,
        };
        try {
            $this->info(
                string: "Updating sortable attributes for [$model] on index [$index]",
            );
            $client->index(
                uid: $index,
            )->updateSortableAttributes(
                sortableAttributes: $model::getSearchSortAttributes(),
            );
        } catch (ApiException $exception) {
            $this->warn(
                string: $exception->getMessage(),
            );
            return self::FAILURE;
        }
        return 0;
    }
}
