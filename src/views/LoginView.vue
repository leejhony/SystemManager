<template>
  <div class="login-container">
    <h1>System Manager</h1>

    <div class="login-box">
      <input type="text" placeholder="Usuário" v-model="username" />
      <input type="password" placeholder="Senha" v-model="password" />
      <button @click="login">Entrar</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (this.username === "admin" && this.password === "123") {
        this.$router.push("/app/dashboard")
      } else {
        alert("Usuário ou senha incorretos")
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-box {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
