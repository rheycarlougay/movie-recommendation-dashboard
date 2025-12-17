<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSearchLog extends Model
{
    protected $fillable = ['ip_address', 'search'];
    protected $visible = ['ip_address', 'search'];

    public static function countSearchByIp($ip)
    {
        return self::where('ip_address', $ip)
            ->where('created_at', '>=', now()->subMinute())
            ->count();
    }

    public static function logSearch($ip, $search)
    {
        return self::create([
            'ip_address' => $ip,
            'search' => $search,
        ]);
    }
}
