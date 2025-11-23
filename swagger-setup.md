# Swagger/OpenAPI Documentation Setup

## Installation

1. Install Swagger packages:
```bash
composer require darkaonline/l5-swagger --dev
composer require zircote/swagger-php --dev
```

2. Publish Swagger config:
```bash
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

3. Generate documentation:
```bash
php artisan l5-swagger:generate
```

## Configuration

Edit `config/l5-swagger.php`:

```php
'paths' => [
    'docs' => storage_path('api-docs'),
    'docs_json' => 'api-docs.json',
    'docs_yaml' => 'api-docs.yaml',
    'annotations' => [
        app_path('Http/Controllers'),
    ],
],
```

## Usage

### Basic Annotation Example

```php
/**
 * @OA\Info(
 *     title="Hải Đăng Meta API",
 *     version="1.0.0",
 *     description="API Documentation for Hải Đăng Meta"
 * )
 */

/**
 * @OA\Post(
 *     path="/api/v1/login",
 *     summary="User login",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name","password"},
 *             @OA\Property(property="name", type="string", example="username"),
 *             @OA\Property(property="password", type="string", format="password", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="user", type="object")
 *         )
 *     ),
 *     @OA\Response(response=422, description="Validation error"),
 *     @OA\Response(response=401, description="Invalid credentials")
 * )
 */
public function login(LoginRequest $request) {
    // ...
}
```

## Access Documentation

After setup, access documentation at:
- Swagger UI: `/api/docs`
- JSON: `/api/docs.json`
- YAML: `/api/docs.yaml`

## Auto-generation

Add to your deployment script:
```bash
php artisan l5-swagger:generate
```

