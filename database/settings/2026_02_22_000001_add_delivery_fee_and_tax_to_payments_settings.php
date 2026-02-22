<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration {
    public function up(): void
    {
        $this->migrator->add('payments.delivery_fee', 0.0);
        $this->migrator->add('payments.tax_percentage', 0.0);
    }
};
