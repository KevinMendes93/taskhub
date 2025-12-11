'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Role } from '@/app/enums/role.enum';
import { User } from '@/models/user.model';
import { userService } from '@/services/user.service';
import { accountService } from '@/services/account.service';
import { unformatCPF } from '@/utils/validators';
import AdminCreateUserForm from './components/AdminCreateUserForm';
import { CreateUserFormData, CreateAccountFormData } from '@/schemas/user.schema';
import AdminCreateAccountForm from './components/AdminCreateAccountForm';

type Tab = 'users' | 'create-user' | 'create-account';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Loading states
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);

  // Form states - Editar Roles
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRoles, setEditRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserFormData) => {
    setError('');
    setSuccess('');
    setLoadingUser(true);

    try {
      // Remove formatação do CPF antes de enviar
      const userData = {
        ...data,
        cpf: unformatCPF(data.cpf),
      };
      
      const response = await userService.createUser(userData);
      if (response.success) {
        setSuccess('Usuário criado com sucesso!');
        loadUsers();
      } else {
        setError(response.message || 'Erro ao criar usuário');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleCreateAccount = async (data: CreateAccountFormData) => {
    setError('');
    setSuccess('');
    setLoadingAccount(true);

    // Encontrar o usuário selecionado
    const selectedUser = users.find(u => u.id === data.userId);
    if (!selectedUser) {
      setError('Usuário não encontrado');
      setLoadingAccount(false);
      return;
    }

    try {
      // Criar payload com o objeto user completo e CPF sem formatação
      const accountData = {
        login: unformatCPF(selectedUser.cpf!),
        password: data.password,
        user: selectedUser,
      };

      const response = await accountService.createAccount(accountData);
      if (response.success) {
        setSuccess('Conta criada com sucesso!');
        loadUsers();
      } else {
        setError(response.message || 'Erro ao criar conta');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleUpdateRoles = async () => {
    if (!editingUser) return;
    setError('');
    setSuccess('');

    try {
      const response = await userService.updateUser(editingUser.id, { roles: editRoles });
      if (response.success) {
        setSuccess('Roles atualizadas com sucesso!');
        setEditingUser(null);
        loadUsers();
      } else {
        setError(response.message || 'Erro ao atualizar roles');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao atualizar roles');
    }
  };

  const openEditRoles = (user: User) => {
    setEditingUser(user);
    setEditRoles(user.roles || []);
  };

  const toggleEditRole = (role: Role, checked: boolean) => {
    setEditRoles(prev =>
      checked ? [...prev, role] : prev.filter(r => r !== role)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Painel de Administração
            </h1>
            <button
              onClick={() => router.push('/principal')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagens */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Menu de Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            👥 Usuários
          </button>
          <button
            onClick={() => setActiveTab('create-user')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
              activeTab === 'create-user'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ➕ Criar Usuário
          </button>
          <button
            onClick={() => setActiveTab('create-account')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
              activeTab === 'create-account'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            🔑 Criar Conta
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {/* Tab: Lista de Usuários */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Lista de Usuários
              </h2>
              {users.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhum usuário cadastrado
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                          Nome
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                          CPF
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                          Roles
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                          Possui Conta?
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                            {user.name}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {user.email}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {user.cpf}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {user.roles?.map(role => (
                                <span
                                  key={role}
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    role === Role.Admin
                                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                  }`}
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {user.possuiConta ? (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                Sim
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                Não
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => openEditRoles(user)}
                              className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
                            >
                              Editar Roles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: Criar Usuário */}
          {activeTab === 'create-user' && (
            <div className='flex flex-col items-center'>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Criar Novo Usuário
              </h2>
              <AdminCreateUserForm
                onSubmit={handleCreateUser}
                isLoading={loadingUser}
                submitButtonText="Criar Usuário"
              />
            </div>
          )}

          {/* Tab: Criar Conta */}
          {activeTab === 'create-account' && (
            <div className='flex flex-col items-center'>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Criar Nova Conta
              </h2>
              <AdminCreateAccountForm
                users={users.filter(user => !user.possuiConta)}
                onSubmit={handleCreateAccount}
                isLoading={loadingAccount}
                submitButtonText="Criar Conta"
              />
            </div>
          )}
        </div>

        {/* Modal de Edição de Roles */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Editar Roles - {editingUser.name}
              </h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={editRoles.includes(Role.User)}
                    onChange={e => toggleEditRole(Role.User, e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                  />
                  <span>User</span>
                </label>
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={editRoles.includes(Role.Admin)}
                    onChange={e => toggleEditRole(Role.Admin, e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                  />
                  <span>Admin</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateRoles}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}