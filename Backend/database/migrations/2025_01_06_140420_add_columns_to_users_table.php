<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['Member', 'Admin'] )->after('password');
            $table->foreignId('team_id')->nullable()->constrained()->after('role')->onDelete('cascade'); // Add team_id column with foreign key
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['team_id']); 
            $table->dropColumn(['role', 'team_id']); 
        });
    }
}
