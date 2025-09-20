<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class ManageRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): BaseResponse
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $user = $request->user();
        $userRole = $user->role;

        // Check if user has the required role or higher privileges
        $roleHierarchy = $this->getRoleHierarchy();
        $requiredLevel = $roleHierarchy[$role] ?? 0;
        $userLevel = $roleHierarchy[$userRole] ?? 0;

        if ($userLevel < $requiredLevel) {
            // Return appropriate response based on request type
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Insufficient privileges for this action.',
                    'required_role' => $role,
                    'user_role' => $userRole,
                ], 403);
            }

            abort(403, 'Insufficient privileges to access this resource.');
        }

        return $next($request);
    }

    /**
     * Get role hierarchy mapping
     * Higher numbers indicate higher privileges
     */
    private function getRoleHierarchy(): array
    {
        return [
            'user' => 1,
            'teacher' => 2,
            'admin' => 3,
        ];
    }
}
