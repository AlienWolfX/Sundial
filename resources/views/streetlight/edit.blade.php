<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Edit Streetlight') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-4">Edit Streetlight</h3>
                    <form action="{{ route('streetlights.update', $streetlight->id) }}" method="POST">
                        @csrf
                        @method('PUT')
                        <!-- Name Field -->
                        <div class="mb-4">
                            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" id="name" value="{{ $streetlight->name }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                        </div>
                        <!-- Location Field -->
                        <div class="mb-4">
                            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" name="location" id="location" value="{{ $streetlight->location }}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                        </div>
                        <!-- Status Field -->
                        <div class="mb-4">
                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" id="status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                                <option value="Active" {{ $streetlight->status == 'Active' ? 'selected' : '' }}>Active</option>
                                <option value="Inactive" {{ $streetlight->status == 'Inactive' ? 'selected' : '' }}>Inactive</option>
                                <option value="Maintenance" {{ $streetlight->status == 'Maintenance' ? 'selected' : '' }}>Maintenance</option>
                            </select>
                        </div>
                        <!-- Buttons -->
                        <div class="flex justify-end">
                            <a href="{{ route('dashboard') }}" class="mr-2 inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</a>
                            <button type="submit" class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
